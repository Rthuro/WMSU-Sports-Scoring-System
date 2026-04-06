import { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils" // className combiner
import { sportsData } from "@/data/sports-data"

export function MatchCombobox({ selectedSport, changeSport }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSport
            ? selectedSport
            : "Select a sport..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sport..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sport found.</CommandEmpty>
            <CommandGroup>
              {sportsData.sportsCardData.map((sport) => (
                <CommandItem
                  key={sport.name}
                  value={sport.name}
                  onSelect={(currentValue) => {
                    changeSport(currentValue)
                    setOpen(false)
                  }}
                >
                  {sport.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedSport === sport.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
