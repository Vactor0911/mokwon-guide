import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MokwonIcon from "../assets/icons/Mokwon.png";
import GitHubIcon from "../assets/icons/Github.svg";
import { theme } from "../theme";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { useCallback } from "react";

interface IconLinkButtonProps extends ButtonProps {
  iconImage: string;
  alt: string;
  tooltip: string;
  style?: React.CSSProperties;
}

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
          {...others}
        />
      </IconButton>
    </Tooltip>
  );
};

const Footer = () => {
  const handleLinkButtonClick = useCallback((url: string) => {
    window.location.href = url;
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
        {/* Buy me a coffee 버튼 */}
        <Button
          startIcon={
            <LocalCafeIcon
              sx={{
                color: "black",
              }}
            />
          }
          sx={{
            background: "#F2F484",
            borderRadius: "50px",
          }}
        >
          <Typography
            variant="h5"
            color="black"
            sx={{
              fontSize: {
                xs: "0.85rem",
                sm: "1.25rem",
              },
            }}
          >
            개발자에게 따뜻한 커피 한 잔 사주기
          </Typography>
        </Button>

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
            iconImage={MokwonIcon}
            alt="Google Form"
            tooltip="구글 폼"
            style={{
              transform: "translateY(2px)",
            }}
            onClick={() => handleLinkButtonClick("/")}
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
