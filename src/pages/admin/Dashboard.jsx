import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

import { getMyShops } from "../../api/shop.api";
import { getShopStats, getBatchShopStats } from "../../api/dashboard.api";
import { getCouponStats } from "../../api/analytics.api";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts";

/* ----------------------------
   GROUP SHOPS BY LOCATION
---------------------------- */
const groupByLocation = (shops) => {
  const grouped = {};

  shops.forEach((shop) => {
    const country = shop.country || "Unknown";
    const state = shop.state || "Unknown";
    const city = shop.city || "Unknown";

    grouped[country] ??= {};
    grouped[country][state] ??= {};
    grouped[country][state][city] ??= [];

    grouped[country][state][city].push(shop);
  });

  return grouped;
};

const Dashboard = () => {
  const { shopId } = useParams();
  const isShopContext = Boolean(shopId);

  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------- FILTER STATES -------- */
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  /* ----------------------------
     LOAD DATA
  ---------------------------- */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        if (isShopContext) {
          const [statRes, analyticsRes] = await Promise.all([
            getShopStats(shopId),
            getCouponStats(shopId),
          ]);

          if (!mounted) return;

          setStats(statRes.data || {});
          setAnalytics(analyticsRes.data || null);
        } else {
          const res = await getMyShops();
          const shopsData = res.data || [];

          if (!mounted) return;
          setShops(shopsData);

          const ids = shopsData.map((s) => s._id || s.id).filter(Boolean);

          if (ids.length > 0) {
            const batchRes = await getBatchShopStats(ids);
            if (!mounted) return;
            setStats(batchRes.data || {});
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [shopId, isShopContext]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  /* -------- FILTER VALUES -------- */
  const countries = [...new Set(shops.map(s => s.country).filter(Boolean))];

  const states = [...new Set(
    shops
      .filter(s => !countryFilter || s.country === countryFilter)
      .map(s => s.state)
      .filter(Boolean)
  )];

  const cities = [...new Set(
    shops
      .filter(s =>
        (!countryFilter || s.country === countryFilter) &&
        (!stateFilter || s.state === stateFilter)
      )
      .map(s => s.city)
      .filter(Boolean)
  )];

  const filteredShops = shops.filter(s =>
    (!countryFilter || s.country === countryFilter) &&
    (!stateFilter || s.state === stateFilter) &&
    (!cityFilter || s.city === cityFilter)
  );

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4">{isShopContext ? "Shop Dashboard" : "Admin Dashboard"}</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* ================= ADMIN DASHBOARD ================= */}
      {!isShopContext && (
        <>
          {/* FILTERS */}
          <Row className="mb-4">
            <Col md={4}>
              <select
                className="form-select"
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setStateFilter("");
                  setCityFilter("");
                }}
              >
                <option value="">All Countries</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </Col>

            <Col md={4}>
              <select
                className="form-select"
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setCityFilter("");
                }}
                disabled={!countryFilter}
              >
                <option value="">All States</option>
                {states.map(s => <option key={s}>{s}</option>)}
              </select>
            </Col>

            <Col md={4}>
              <select
                className="form-select"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                disabled={!stateFilter}
              >
                <option value="">All Cities</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </Col>
          </Row>

          {Object.entries(groupByLocation(filteredShops)).map(([country, states]) => (
            <div key={country}>
              <h5>{country}</h5>

              {Object.entries(states).map(([state, cities]) => (
                <div key={state} className="ms-3">
                  <h6>{state}</h6>

                  {Object.entries(cities).map(([city, cityShops]) => (
                    <div key={city} className="ms-3 mb-3">
                      <small className="text-muted">{city}</small>

                      <Row>
                        {cityShops.map(shop => {
                          const id = shop._id || shop.id;
                          const shopStats = stats[id] || {};

                          return (
                            <Col key={id} md={6} lg={4} className="mb-4">
                              <Card className="h-100 shadow-sm">
                                <Card.Body className="d-flex flex-column">
                                  <h6>{shop.shop_name}</h6>

                                  <small className="text-muted mb-2">
                                    ⭐ {shopStats.avgRating || "0.0"} ·{" "}
                                    {shopStats.totalFeedback || 0} feedback
                                  </small>

                                  <div className="mt-auto d-grid gap-2">
                                    <Link to={`/admin/shop/${id}/dashboard`}>
                                      <Button size="sm" variant="outline-primary">Dashboard</Button>
                                    </Link>
                                    <Link to={`/admin/shop/${id}/analytics`}>
                                      <Button size="sm" variant="outline-secondary">Analytics</Button>
                                    </Link>
                                    <Link to={`/admin/shop/${id}/settings`}>
                                      <Button size="sm" variant="outline-dark">Settings</Button>
                                    </Link>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* ================= SHOP DASHBOARD ================= */}
      {isShopContext && stats && (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Feedback</Card.Title>
                  <h4>{stats.totalFeedback || 0}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Avg Rating</Card.Title>
                  <h4>{stats.avgRating || "0.0"}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {analytics && <AnalyticsCharts analytics={analytics} />}
        </>
      )}
    </Container>
  );
};

export default Dashboard;