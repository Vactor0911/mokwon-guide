import { Box, ButtonProps, IconButton, Stack, Tooltip } from "@mui/material";
import MokwonIcon from "../assets/icons/Mokwon.png";
import GoogleFormsIcon from "../assets/icons/GoogleForms.svg";
import GitHubIcon from "../assets/icons/Github.svg";
import { theme } from "../theme";
import { useCallback } from "react";

interface IconLinkButtonProps extends ButtonProps {
  iconImage: string;
  alt: string;
  tooltip: string;
  style?: React.CSSProperties;
}

// 아이콘 링크 버튼 컴포넌트
const IconLinkButton = (props: IconLinkButtonProps) => {
  const { iconImage, alt, tooltip, onClick, ...others } = props;

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton onClick={onClick}>
        <Box
          component="img"
          src={iconImage}
          alt={alt}
          width={{
            xs: "40px",
            sm: "50px",
          }}
          height={{
            xs: "40px",
            sm: "50px",
          }}
          {...others}
        />
      </IconButton>
    </Tooltip>
  );
};

const Footer = () => {
  // 링크 버튼 클릭
  const handleLinkButtonClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <Stack
      padding="12px"
      alignItems="center"
      sx={{
        background: theme.palette.primary.main,
      }}
    >
      <Stack width="100%" maxWidth="500px" spacing={2}>
        {/* 외부 링크 컨테이너 */}
        <Stack
          direction="row"
          padding={1}
          justifyContent="space-between"
          sx={{
            background: theme.palette.secondary.main,
            borderRadius: "10px",
          }}
        >
          {/* 목원대학교 버튼 */}
          <IconLinkButton
            iconImage={MokwonIcon}
            alt="Mokwon University"
            tooltip="목원대학교"
            style={{
              transform: "translateY(2px)",
            }}
            onClick={() =>
              handleLinkButtonClick("https://www.mokwon.ac.kr/kr/")
            }
          />

          {/* 목원대학교 컴공과 버튼 */}
          <IconLinkButton
            iconImage={MokwonIcon}
            alt="Mokwon University Computer Science"
            tooltip="목원대학교 컴퓨터공학과"
            style={{
              transform: "translateY(2px)",
            }}
            onClick={() =>
              handleLinkButtonClick("https://mokwon.ac.kr/computer/")
            }
          />

          {/* 구글 폼 버튼 */}
          <IconLinkButton
            iconImage={GoogleFormsIcon}
            alt="Google Form"
            tooltip="구글 폼"
            onClick={() =>
              handleLinkButtonClick(
                "https://docs.google.com/forms/d/1_cw78MTL8nG2rP3Q93avoQO-mhJgmOYpZM9snBP9vPE/"
              )
            }
          />

          {/* 깃허브 리포지토리 버튼 */}
          <IconLinkButton
            iconImage={GitHubIcon}
            alt="GitHub"
            tooltip="깃허브"
            onClick={() =>
              handleLinkButtonClick(
                "https://github.com/Vactor0911/mokwon-guide"
              )
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
