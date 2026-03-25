
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthDropdown({
  isMobile,
  onAuthAction,
}: {
  isMobile?: boolean;
  onAuthAction?: () => void;
}) {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      onAuthAction?.(); // Close mobile menu if open
      router.push('/');
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return <UserIcon />;
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0];
  };

  if (!user) {
    return null;
  }
  
  if (isMobile) {
     return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 border-b pb-4 px-2">
                <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div className='truncate'>
                    <p className="font-semibold truncate">{user.displayName || 'User'}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
            </div>
             <Link href="/dashboard" onClick={onAuthAction} className="flex items-center p-2 rounded-md hover:bg-muted font-medium"><LayoutDashboard className="mr-2"/>Dashboard</Link>
            <button onClick={handleLogout} className="flex items-center p-2 rounded-md hover:bg-muted font-medium w-full text-left"><LogOut className="mr-2"/>Logout</button>
        </div>
     )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage
              src={user.photoURL || undefined}
              alt={user.displayName || 'User'}
            />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

    