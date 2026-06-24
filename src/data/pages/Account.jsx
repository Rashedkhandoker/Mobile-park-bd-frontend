import { RiFileTextLine, RiHomeLine, RiMapPinLine } from 'react-icons/ri';

export const sidebarMenu = [
  {
    title: 'Dashboard',
    icon: <RiHomeLine className='me-2'/>,
    id: 'dashboard',
    path: '/account/dashboard',
  },
  {
    title: 'MyOrders',
    icon: <RiFileTextLine className='me-2'/>,
    id: 'order',
    path: '/account/order',
  },
  {
    title: 'SavedAddress',
    icon: <RiMapPinLine className='me-2'/>,
    id: 'address',
    path: '/account/addresses',
  },
];
