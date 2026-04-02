import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Layout() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <Box className="app-root" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <StorefrontIcon sx={{ mr: 0.5 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: { xs: 1, sm: 0 }, textDecoration: 'none', color: 'inherit', mr: 2 }}
          >
            MultiVendor
          </Typography>
          <Button color="inherit" component={RouterLink} to="/products">
            Products
          </Button>
          {user && (
            <>
              <Button color="inherit" component={RouterLink} to="/cart">
                Cart
              </Button>
              <Button color="inherit" component={RouterLink} to="/orders">
                My orders
              </Button>
            </>
          )}
          {user && hasRole('vendor') && (
            <>
              <Button color="inherit" component={RouterLink} to="/vendor/products/new">
                Add product
              </Button>
              <Button color="inherit" component={RouterLink} to="/vendor/orders">
                Vendor orders
              </Button>
            </>
          )}
          {user && hasRole('admin') && (
            <Button color="inherit" component={RouterLink} to="/admin/users">
              Users
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                {user.name} · {user.role}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Log in
              </Button>
              <Button variant="outlined" color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
          {user && (
            <IconButton color="inherit" component={RouterLink} to="/cart" aria-label="Cart">
              <ShoppingCartOutlinedIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <Box component="footer" className="app-footer" sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Multi-vendor storefront · API via <code>/api</code>
        </Typography>
      </Box>
    </Box>
  )
}
