import { FC } from 'react';
import { useSelector } from 'src/store/Store';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';
import { styled } from '@mui/material';
import { AppState } from 'src/store/Store';
import imagelogo from 'src/assets/images/logos/logo (2).svg';

const Logo: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: '70px',
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/" className="p-4 flex justify-center items-center w-full ">
        <img src={imagelogo} className="w-1/3 items-center" />
        <p className="text-[#5D87FF] font-bold w-full my-auto">Kmsolution</p>
      </LinkStyled>
    );
  }

  return (
    <LinkStyled to="/">
      {customizer.activeMode === 'dark' ? (
        <LogoDarkRTL height={customizer.TopbarHeight} />
      ) : (
        <LogoLightRTL height={customizer.TopbarHeight} />
      )}
    </LinkStyled>
  );
};

export default Logo;
