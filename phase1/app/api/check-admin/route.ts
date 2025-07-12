import { NextResponse } from 'next/server';

// These would ideally be stored in environment variables or a database
const ADMIN_WALLETS = [
  "8ZUn9G36BMSRojNW7wtneL5YEQBKzz4hTzWqRwUYJ9Jj", // Replace with your actual admin wallet
  "6Ks9G8fyo5RwTGrpYPTnNGVXwkMEWtR8AEKvf7Yc1cuz", // Another admin wallet
  // Add other admin wallets here
];

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json();
    
    if (!wallet) {
      return NextResponse.json({ isAdmin: false }, { status: 400 });
    }
    
    const isAdmin = ADMIN_WALLETS.includes(wallet);
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
