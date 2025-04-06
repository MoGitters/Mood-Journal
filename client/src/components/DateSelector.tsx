import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [open, setOpen] = useState(false);

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        size="icon"
        className="p-2 rounded-full hover:bg-pastel-purple hover:bg-opacity-20 transition"
        onClick={handlePreviousDay}
      >
        <span className="text-xl text-pastel-purple">←</span>
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-purple bg-opacity-20 hover:bg-opacity-30 transition shadow-sm"
            )}
          >
            <span className="text-pastel-purple font-medium">
              {format(selectedDate, "MMMM d, yyyy")}
            </span>
            <span className="text-pastel-purple">📅</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button
        variant="ghost"
        size="icon"
        className="p-2 rounded-full hover:bg-pastel-purple hover:bg-opacity-20 transition"
        onClick={handleNextDay}
      >
        <span className="text-xl text-pastel-purple">→</span>
      </Button>
    </div>
  );
}
