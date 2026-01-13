import { Link, useParams, useLocation } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

const Breadcrumbs = () => {
  const { shopId } = useParams();
  const location = useLocation();

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/admin/dashboard" }}>
        Admin
      </Breadcrumb.Item>

      {shopId && (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/admin/shop/${shopId}/dashboard` }}>
          Shop
        </Breadcrumb.Item>
      )}

      {location.pathname.includes("analytics") && (
        <Breadcrumb.Item active>Analytics</Breadcrumb.Item>
      )}

      {location.pathname.includes("dashboard") && shopId && (
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
