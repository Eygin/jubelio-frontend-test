import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrawerDialogProps {
  children: React.ReactNode;
  title: string;
  desc?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  classNameDialog?: string;
  viewPortClassName?: string;
}

export function DrawerDialog({
  children,
  title,
  desc,
  setOpen,
  open,
  classNameDialog,
  viewPortClassName,
}: DrawerDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "sm:max-w-[425px]",
            classNameDialog,
            viewPortClassName,
            "!max-h-[80vh] overflow-y-auto",
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {desc && <DialogDescription>{desc}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {desc && <DrawerDescription>{desc}</DrawerDescription>}
        </DrawerHeader>
        <ScrollArea
          viewPortClassName={cn(
            "p-4",
            viewPortClassName,
            "!max-h-[80vh] overflow-y-auto",
          )}
        >
          {children}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
