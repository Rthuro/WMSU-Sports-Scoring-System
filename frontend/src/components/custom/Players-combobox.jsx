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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"


export function PlayerCombobox({
  players = [],
  selectedPlayers = [],
  setSelectedPlayers,
  maxSelect = 1,
  label = "Select players"
}) {
  const [open, setOpen] = useState(false)

  const togglePlayer = (player) => {
    const isSelected = selectedPlayers.includes(player)
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player))
    } else if (selectedPlayers.length < maxSelect) {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPlayers.length > 0
            ? `${selectedPlayers.join(", ")}`
            : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search player..." className="h-9" />
          <CommandList>
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup>
              {players.map((player) => (
                <CommandItem
                  key={player}
                  value={player}
                  onSelect={() => togglePlayer(player)}
                >
                  {player}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedPlayers.includes(player) ? "opacity-100" : "opacity-0"
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
