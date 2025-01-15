/*
 * This is the project card skeleton (client) component
 * It allows to display a loading animation for the project card while the server component is loading
 * Usually the effect is not perceived in localhost, but helps with the interactivity under low speed connections
 */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// The skeleton for the project card is essentially the same as the project card but with empty values
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

// This is the skeleton for the project list
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