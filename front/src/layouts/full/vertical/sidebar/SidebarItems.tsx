import React from 'react';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'src/store/Store';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { AppState } from 'src/store/Store';
import MenuItems from './MenuItems';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const Menuitems = MenuItems();
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          if (
            user?.acces?.includes(item?.role) ||
            item.role === 'home' ||
            (item.role === 'entreprise' && user?._id === user?.admin)
          ) {
            // {/********SubHeader**********/}
            if (item.subheader) {
              return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

              // {/********If Sub Menu**********/}
              /* eslint no-else-return: "off" */
            } else if (item.children) {
              return (
                <NavCollapse
                  menu={item}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  pathWithoutLastPart={pathWithoutLastPart}
                  level={1}
                  key={item.id}
                  onClick={() => dispatch(toggleMobileSidebar())}
                />
              );

              // {/********If Sub No Menu**********/}
            } else {
              return (
                <NavItem
                  item={item}
                  key={item.id}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  onClick={() => dispatch(toggleMobileSidebar())}
                />
              );
            }
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
