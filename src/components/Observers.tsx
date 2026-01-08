import React, { useState } from "react";
import { Observer } from "types-generated";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  observers: Observer[];
}

export const Observers: React.FC<Props> = ({ observers }) => {
  if (observers.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2">
          <Eye className="mr-2 h-4 w-4" />
          {observers.length} {observers.length === 1 ? "Observer" : "Observers"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Observers</DialogTitle>
          <DialogDescription>
            People watching this session
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {observers.map((o) => (
            <div key={o.name} className="text-sm font-medium py-2">
              {o.name}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
