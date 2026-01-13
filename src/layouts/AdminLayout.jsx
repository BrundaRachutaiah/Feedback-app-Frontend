import { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Container, Nav, Button, Offcanvas } from "react-bootstrap";
import Breadcrumbs from "../components/common/Breadcrumbs";

const AdminLayout = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { shopId } = useParams();
  const isShopContext = Boolean(shopId);

  const SidebarContent = () => (
    <>
      <h6 className="text-center py-3 border-bottom">
        Feedback Manager
      </h6>

      <Nav className="flex-column px-2">

        {/* GLOBAL ADMIN */}
        {!isShopContext && (
          <>
            <NavLink to="/admin/dashboard" className="nav-link">
              Dashboard
            </NavLink>

            <NavLink to="/admin/shops" className="nav-link">
              Shops
            </NavLink>

            <NavLink to="/admin/analytics" className="nav-link">
              Analytics
            </NavLink>
          </>
        )}

        {/* SHOP CONTEXT */}
        {isShopContext && (
          <>
            <NavLink to="/admin/shops" className="nav-link">
              ← Back to Shops
            </NavLink>

            <NavLink
              to={`/admin/shop/${shopId}/dashboard`}
              className="nav-link"
            >
              Dashboard
            </NavLink>

            <NavLink
              to={`/admin/shop/${shopId}/analytics`}
              className="nav-link"
            >
              Analytics
            </NavLink>

            <NavLink
              to={`/admin/shop/${shopId}/feedback`}
              className="nav-link"
            >
              Feedback
            </NavLink>
          </>
        )}
      </Nav>
    </>
  );

  return (
    <div className="d-flex">
      <div className="admin-sidebar d-none d-md-block">
        <SidebarContent />
      </div>

      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Feedback Manager</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="admin-content flex-grow-1">
        <div className="d-md-none p-2 border-bottom">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowMenu(true)}
          >
            ☰ Menu
          </Button>
        </div>

        <Container fluid className="py-3">
          <Breadcrumbs />
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;