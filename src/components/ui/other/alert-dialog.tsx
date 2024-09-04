import toast from "react-hot-toast";

import {
  AlertDialog as AlertDialogContainer,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { INTERNAL_SERVER_ERROR } from "@/data/error-messages";
import { useAlertDialog } from "@/lib/hooks/use-alert-dialog";

interface AlertDialogProps {
  onAccept: (itemId: number) => void;
}

export function AlertDialog({ onAccept }: AlertDialogProps) {
  const alertDialog = useAlertDialog();

  // Handle on accept
  const handleOnAccept = () => {
    if (!alertDialog.itemId) {
      return toast.error(INTERNAL_SERVER_ERROR);
    }

    onAccept(alertDialog.itemId);
    alertDialog.close();
  };

  return (
    <AlertDialogContainer open={alertDialog.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={alertDialog.close}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleOnAccept}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogContainer>
  );
}
