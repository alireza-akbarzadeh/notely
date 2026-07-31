"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { formatMemberSince, getUserInitials } from "@/lib/user-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  variant?: "header" | "sidebar";
  className?: string;
};

export function UserMenu({ variant = "header", className }: UserMenuProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Skeleton className="size-8 rounded-full" />
        {variant === "header" ? (
          <div className="hidden min-w-0 md:block">
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ) : null}
      </div>
    );
  }

  const initials = getUserInitials(user?.name, user?.email);
  const memberSince = formatMemberSince(user?.createdAt);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          variant === "sidebar" ? (
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-2 px-2 py-2",
                className,
              )}
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                image={user?.image}
                initials={initials}
                size="sm"
              />
              <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">
                  {user?.name ?? "Account"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "Not signed in"}
                </p>
              </div>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                "h-auto gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted/60",
                className,
              )}
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                image={user?.image}
                initials={initials}
                size="md"
              />
              <div className="hidden min-w-0 text-left md:block">
                <p className="truncate text-sm font-medium leading-none">
                  {user?.name ?? "Account"}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user?.email ?? "Guest"}
                </p>
              </div>
            </Button>
          )
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-72 p-0"
        side={variant === "sidebar" ? "right" : "bottom"}
      >
        <div className="border-b border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={user?.name}
              email={user?.email}
              image={user?.image}
              initials={initials}
              size="lg"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-medium">{user?.name ?? "Nexora User"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "No email on file"}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {user?.emailVerified ? (
                  <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px]">
                    <BadgeCheck className="size-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    Unverified
                  </Badge>
                )}
                {memberSince ? (
                  <span className="text-[10px] text-muted-foreground">
                    Member since {memberSince}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuGroup className="p-1">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/portfolio")}>
            <Wallet className="size-4" />
            Portfolio
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            Security
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <ShieldCheck className="size-4" />
            Two-factor auth
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <User className="size-4" />
            Edit profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({
  name,
  email,
  image,
  initials,
  size = "md",
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "size-10" : size === "sm" ? "size-7" : "size-8";

  return (
    <Avatar className={cn(sizeClass, "ring-1 ring-border")}>
      {image ? (
        <AvatarImage src={image} alt={name ?? email ?? "User avatar"} />
      ) : null}
      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
