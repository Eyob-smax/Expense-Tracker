import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function ButtonWithLink({
  to,
  children,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <div className="text-right mt-3 ">
      <Link to={to}>
        <Button className="bg-[#F0F2F5] rounded-2xl" {...rest}>
          {children}
        </Button>
      </Link>
    </div>
  );
}
