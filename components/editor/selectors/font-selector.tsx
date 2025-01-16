import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/editor/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";

export interface BubbleFontMenuItem {
  name: string;
  fontFamily: string;
}

const FONT_FAMILIES: BubbleFontMenuItem[] = [
  {
    name: "Default",
    fontFamily: "var(--font-default)",
  },
  {
    name: "Sans Serif",
    fontFamily: "ui-sans-serif, system-ui, -apple-system",
  },
  {
    name: "Monospace",
    fontFamily: "ui-monospace, monospace",
  },
  {
    name: "Serif",
    fontFamily: "ui-serif, Georgia",
  },
  {
    name: "Montserrat",
    fontFamily: "'Montserrat', sans-serif",
  },
  {
    name: "Comic Sans",
    fontFamily: "'Comic Sans MS', cursive",
  },
  {
    name: "Cursive",
    fontFamily: "cursive",
  },
];

interface FontSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FontSelector = ({ open, onOpenChange }: FontSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;

  const activeFontItem = FONT_FAMILIES.find(({ fontFamily }) =>
    editor.isActive("textStyle", { fontFamily })
  );

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" className="gap-2 rounded-none" variant="ghost">
          <span
            className="rounded-sm px-1"
            style={{
              fontFamily: activeFontItem?.fontFamily,
            }}
          >
            Font
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          {FONT_FAMILIES.map(({ name, fontFamily }) => (
            <EditorBubbleItem
              key={name}
              onSelect={() => {
                if (name === "Default") {
                  editor.chain().focus().unsetFontFamily().run();
                } else {
                  editor.chain().focus().setFontFamily(fontFamily).run();
                }
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <span style={{ fontFamily }}>Aa</span>
                <span>{name}</span>
              </div>
              {editor.isActive("textStyle", { fontFamily }) && (
                <Check className="h-4 w-4" />
              )}
            </EditorBubbleItem>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};