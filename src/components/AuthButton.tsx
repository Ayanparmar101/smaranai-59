
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { toast } from 'sonner';

const AuthButton = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUsername(data?.username || user.email?.split('@')[0]);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span className="max-w-[100px] truncate">
            {username || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
