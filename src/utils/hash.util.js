import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashear = async (password) => bcrypt.hash(password, SALT_ROUNDS);

export const compararPassword = async (password, hash) => bcrypt.compare(password, hash);
