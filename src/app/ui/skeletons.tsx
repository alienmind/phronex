import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <>
      <div className="w-[350px]" >
        <Card className={shimmer}>
          <CardHeader>
            <CardTitle>&nbsp;</CardTitle>
            <CardDescription>&nbsp;</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
          <CardFooter>
            <Button className=" w-full m-2" variant="ghost" disabled>&nbsp;</Button>
            <Button className=" w-full m-2" variant="ghost" disabled>&nbsp;</Button>
            <Button className=" w-full m-2" variant="ghost" disabled>&nbsp;</Button>
            <Button className=" w-full m-2" variant="destructive">&nbsp;</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export function ProjectCardListSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}