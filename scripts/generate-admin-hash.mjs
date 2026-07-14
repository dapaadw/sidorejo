import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'Sidorejo@maju';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);

console.log('Username : miminsidorejo');
console.log(`Password : ${password}`);
console.log(`Hash     : ${hash}`);
console.log('\nGunakan nilai Hash untuk kolom password_hash di supabase/sql/schema.sql.');
