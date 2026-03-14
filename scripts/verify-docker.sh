#!/bin/bash
# =============================================================
# Docker Compose Verification Script
# Builds, starts, and validates both backend + frontend services
# =============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

COMPOSE_FILE="docker-compose.yml"
BACKEND_URL="http://localhost:12001"
FRONTEND_URL="http://localhost:12000"
MAX_RETRIES=30
RETRY_INTERVAL=2

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cleanup() {
  log_info "Cleaning up containers..."
  docker compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true
}

# ---- Step 1: Validate docker-compose.yml syntax ----
step_validate_config() {
  log_info "Step 1: Validating docker-compose.yml syntax..."
  if docker compose -f "$COMPOSE_FILE" config --quiet 2>/dev/null; then
    log_info "docker-compose.yml syntax is valid."
  else
    log_error "docker-compose.yml has syntax errors!"
    docker compose -f "$COMPOSE_FILE" config
    exit 1
  fi
}

# ---- Step 2: Build images ----
step_build() {
  log_info "Step 2: Building Docker images..."
  if docker compose -f "$COMPOSE_FILE" build --no-cache; then
    log_info "All images built successfully."
  else
    log_error "Docker build failed!"
    exit 1
  fi
}

# ---- Step 3: Start services ----
step_start() {
  log_info "Step 3: Starting services..."
  docker compose -f "$COMPOSE_FILE" up -d
  log_info "Services started."
}

# ---- Step 4: Wait for services to be healthy ----
wait_for_service() {
  local name="$1"
  local url="$2"
  local retries=0

  log_info "Waiting for $name at $url ..."
  while [ $retries -lt $MAX_RETRIES ]; do
    if curl -sf "$url" > /dev/null 2>&1; then
      log_info "$name is UP and responding."
      return 0
    fi
    retries=$((retries + 1))
    sleep $RETRY_INTERVAL
  done

  log_error "$name did not become healthy after $((MAX_RETRIES * RETRY_INTERVAL))s"
  return 1
}

step_healthcheck() {
  log_info "Step 4: Checking service health..."

  local failed=0

  if ! wait_for_service "Backend" "$BACKEND_URL/api/config"; then
    failed=1
  fi

  if ! wait_for_service "Frontend" "$FRONTEND_URL"; then
    failed=1
  fi

  if [ $failed -ne 0 ]; then
    log_error "Health checks failed. Dumping container logs:"
    echo ""
    echo "===== BACKEND LOGS ====="
    docker compose -f "$COMPOSE_FILE" logs backend --tail=50
    echo ""
    echo "===== FRONTEND LOGS ====="
    docker compose -f "$COMPOSE_FILE" logs frontend --tail=50
    exit 1
  fi
}

# ---- Step 5: Verify container status ----
step_verify_containers() {
  log_info "Step 5: Verifying container status..."

  local all_running=true
  for service in backend frontend; do
    local status
    status=$(docker compose -f "$COMPOSE_FILE" ps --format '{{.State}}' "$service" 2>/dev/null)
    if [ "$status" = "running" ]; then
      log_info "  $service: running"
    else
      log_error "  $service: $status (expected: running)"
      all_running=false
    fi
  done

  if [ "$all_running" = false ]; then
    log_error "Not all containers are running!"
    exit 1
  fi
}

# ---- Step 6: Quick API smoke test ----
step_smoke_test() {
  log_info "Step 6: Running API smoke tests..."

  # Test backend API
  local api_response
  api_response=$(curl -sf "$BACKEND_URL/api/config" 2>/dev/null)
  if [ $? -eq 0 ]; then
    log_info "  Backend /api/config: OK"
  else
    log_error "  Backend /api/config: FAILED"
    exit 1
  fi

  # Test frontend page
  local frontend_response
  frontend_response=$(curl -sf -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
  if [ "$frontend_response" = "200" ]; then
    log_info "  Frontend /: OK (HTTP 200)"
  else
    log_warn "  Frontend /: HTTP $frontend_response (may still be OK for redirects)"
  fi
}

# ---- Main ----
main() {
  echo ""
  echo "=========================================="
  echo "  Docker Compose Verification"
  echo "=========================================="
  echo ""

  # Change to project root (where docker-compose.yml lives)
  cd "$(dirname "$0")/.."

  trap cleanup EXIT

  step_validate_config
  step_build
  step_start
  step_healthcheck
  step_verify_containers
  step_smoke_test

  echo ""
  log_info "=========================================="
  log_info "  ALL CHECKS PASSED"
  log_info "=========================================="
  echo ""
  log_info "Backend:  $BACKEND_URL"
  log_info "Frontend: $FRONTEND_URL"
  echo ""
}

main "$@"
