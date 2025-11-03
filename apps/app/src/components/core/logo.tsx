import { Typography } from 'antd';
import React from 'react';
import { styled } from 'styled-components';
import { useGetColourTheme } from '../../state/theme';
import { APP_BAR_HEIGHT } from '../../utils/constants';
import { getEnv } from '../../utils/env';
import { useScreens } from '../../hooks/use-screens';

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 6,
  height: APP_BAR_HEIGHT,
  gap: 12,
})

const Text = styled(Typography.Text)({
  fontFamily: "'Kanit', sans-serif",
  fontSize: '2em',
  fontWeight: 100,
})

interface Props {
  theme?: 'light' | 'dark';
  forceBlack?: boolean;
}

export const Logo: React.FC<Props> = ({ theme, forceBlack }) => {
  const screens = useScreens();
  const colourTheme = useGetColourTheme();
  const { appName } = getEnv();

  if (!theme) {
    theme = colourTheme;
  }

  return (
    <Wrapper>
      <img src="/vite.svg" width={30} />
      <Text
        style={{
          color: forceBlack ? 'black' : (theme === 'dark' ? 'white' : 'black'),
        }}>
        
        {screens.lg && appName}
      </Text>
    </Wrapper>
  )
}
