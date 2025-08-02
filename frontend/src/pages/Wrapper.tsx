import useSetUser from "../hooks/useSetUser";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  useSetUser();

  return <>{children}</>;
}
