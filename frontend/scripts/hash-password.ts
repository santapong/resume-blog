#!/usr/bin/env bun
// Usage: bun scripts/hash-password.ts <password>
// Prints a bcrypt hash suitable for ADMIN_PASSWORD_HASH.

import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
    console.error('Usage: bun scripts/hash-password.ts <password>');
    process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
