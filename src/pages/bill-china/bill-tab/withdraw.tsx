import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Withdraw: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Bank name</Label>
          <Input id="current" type="text" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">Bank number</Label>
          <Input id="new" type="text" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="money">Amount</Label>
          <Input id="" type="number" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
};

export default Withdraw;
