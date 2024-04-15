import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import Icon from "@/components/Icon";
import DeleteUserButton from "./DeleteUserButton";

export default async function ListUsersDialog(props: {
   savingsId: string;
   isOwner: boolean;
}) {
   const savings = await db.savings.findFirst({
      where: { id: props.savingsId },
      include: {
         SavingsUser: {
            select: {
               user: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                  },
               },
            },
         },
      },
   });

   if (!savings) return null;

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button>Users</Button>
         </DialogTrigger>
         <DialogContent className="md:max-w-[960px]">
            <DialogHeader>
               <DialogTitle>List Users</DialogTitle>
               <DialogDescription>
                  List of users in this savings group
               </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 py-4">
               {savings?.SavingsUser.map((savingsUser) => (
                  <div
                     key={savingsUser.user.id}
                     className="p-3 border border-primary rounded-lg"
                  >
                     <p className="text-center flex items-center">
                        <span className="mr-2">
                           <Icon icon={"gg:profile"} className="w-6 h-6" />{" "}
                        </span>
                        {savingsUser.user.firstName} {savingsUser.user.lastName}
                     </p>
                     {savingsUser.user.id !== savings.creatorId ? (
                        <DeleteUserButton
                           isOwner={props.isOwner}
                           savingsId={props.savingsId}
                           userId={savingsUser.user.id}
                        />
                     ) : (
                        <Button
                           className="mt-4 w-full"
                           disabled
                           variant={"destructive"}
                        >
                           Owner
                        </Button>
                     )}
                  </div>
               ))}
            </div>
         </DialogContent>
      </Dialog>
   );
}
