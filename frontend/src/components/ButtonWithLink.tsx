import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function ButtonWithLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-right mt-3 ">
      <Link to={to}>
        <Button className="bg-[#F0F2F5] rounded-2xl">{children}</Button>
      </Link>
    </div>
  );
}
