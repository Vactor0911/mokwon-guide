import { Link, LinkProps } from "react-router";

interface DrawerNavLink extends LinkProps {
  to: string;
  children?: React.ReactNode;
}

const DrawerNavLink = (props: DrawerNavLink) => {
  const { to, children, ...others } = props;

  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
      {...others}
    >
      {children}
    </Link>
  );
};

export default DrawerNavLink;
