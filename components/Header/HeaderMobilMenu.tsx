import { useState } from "react";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
  ClickAwayListener,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const HeaderMobileMenu = () => {
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const handleMarketplace = () => {
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="c-header-mobile-container">
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <List component="nav" aria-labelledby="nested-list-subheader">
          <div className="c-header-mobile-logo" onClick={handleModal}>
            <img src="/logo.png" className="c-header-logo-img" alt="logo"></img>
            <span className="c-header-logo-name">Zilionixx</span>
            {open ? (
              <ExpandLess className="c-header-mobile-icon" />
            ) : (
              <ExpandMore className="c-header-mobile-icon" />
            )}
          </div>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            className="c-header-mobile-menu-collapse"
          >
            <List
              component="div"
              disablePadding
              className="c-header-mobile-menu-content"
            >
              <ListItem
                button
                onClick={handleMarketplace}
                className="active-list"
                disableRipple
              >
                <ListItemText primary="Staking" />
              </ListItem>
              <ListItem button onClick={handleMarketplace} disableRipple>
                <ListItemText primary="Block Explorer" />
              </ListItem>
              <ListItem button onClick={handleMarketplace} disableRipple>
                <ListItemText primary="DongleTrade" />
              </ListItem>
              <ListItem button onClick={handleMarketplace} disableRipple>
                <ListItemText primary="DEX/NFT" />
              </ListItem>
              <ListItem button onClick={handleMarketplace} disableRipple>
                <ListItemText primary="Unicial" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </ClickAwayListener>
    </div>
  );
};

export default HeaderMobileMenu;
