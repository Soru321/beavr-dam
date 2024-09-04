import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup,
    DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";

  // TODO: data type should be Status
  const handleStatusChange = (data: string) => {
    const current = new URLSearchParams([...searchParams.entries()]);
    if (!data) current.delete("status");
    else current.set("status", data.toString());

    const params = current.toString();
    const query = !!params ? `?${params}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value="">None</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="completed">
            Completed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="incompleted">
            Incompleted
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
