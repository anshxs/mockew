"use client";

import { UserButton } from "@stackframe/stack";
import { useUser } from "@stackframe/stack";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { PanelRight } from "lucide-react"


export default function Header() {
  const user = useUser();
  
  return (
     <SidebarProvider>
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>
      <div className="flex items-center gap-2">
        <UserButton />
         <SidebarTrigger className="h-9 w-9">
            <PanelRight className="h-5 w-5" />
          </SidebarTrigger>
      </div>
    </header>
       <Sidebar side="right" variant="floating">
        <SidebarHeader>
          <h2 className="text-lg font-semibold px-2">Menu</h2>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard" className="w-full">
                  <Button variant="ghost" className="bg-secondary w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/pricing" className="w-full">
                  <Button variant="ghost" className="w-full justify-start bg-secondary ">
                    Pricing
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/terms" className="w-full">
                  <Button variant="ghost" className="w-full justify-start bg-secondary ">
                    Terms and Conditions
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/contact" className="w-full">
                  <Button variant="ghost" className="w-full justify-start bg-secondary ">
                    Contact Us
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/refund" className="w-full">
                  <Button variant="ghost" className="w-full justify-start bg-secondary mb-2">
                    Refund Policy
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/handler/account-settings" className="w-full">
                  <div className="bg-secondary rounded-xl border-2 flex items-center p-4 space-x-4">
  <div className="flex items-center space-x-4">
    <UserButton />
    <div className="w-px bg-gray-300 h-10" />
  </div>
  <div className="flex flex-col">
    <span className="text-lg font-semibold">
      {user?.displayName ?? "Sign In"}
    </span>
    {user?.displayName && user.primaryEmail && (
      <span className="text-sm text-muted-foreground">
        {user.primaryEmail}
      </span>
    )}
  </div>
</div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
        }
