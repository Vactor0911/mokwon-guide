import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MokwonIcon from "../assets/icons/Mokwon.png";
import ComputerEngineeringIcon from "../assets/icons/dept-computer-engineering.png";
import MokwonViewIcon from "../assets/icons/MokwonView.png";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import GitHubIcon from "../assets/icons/Github.svg";
import { useCallback } from "react";

interface IconLinkButtonProps extends ButtonProps {
  iconImage: string;
  alt: string;
  tooltip: string;
  sx?: React.CSSProperties;
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
  const theme = useTheme();

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
        {/* 구글폼 버튼 */}
        <Button
          color="inherit"
          sx={{
            padding: "4px",
            background: "#f2f484",
            borderRadius: "50px",
            color: "#404040",
          }}
          onClick={() =>
            handleLinkButtonClick(
              "https://docs.google.com/forms/d/1_cw78MTL8nG2rP3Q93avoQO-mhJgmOYpZM9snBP9vPE/"
            )
          }
        >
          <CampaignRoundedIcon
            sx={{
              mr: 1,
            }}
          />

          {/* 구글폼 문구 */}
          <Typography variant="h6">소중한 의견을 남겨주세요!</Typography>
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
            sx={{
              transform: "translateY(2px)",
            }}
            onClick={() =>
              handleLinkButtonClick("https://www.mokwon.ac.kr/kr/")
            }
          />

          {/* 목원대학교 컴공과 버튼 */}
          <IconLinkButton
            iconImage={ComputerEngineeringIcon}
            alt="Mokwon University Computer Engineering"
            tooltip="목원대학교 컴퓨터공학과"
            sx={{
              padding: 0.5,
              backgroundColor: "#ac1d3d",
              borderRadius: "50%",
            }}
            onClick={() =>
              handleLinkButtonClick("https://mokwon.ac.kr/computer/")
            }
          />

          {/* 목원뷰 버튼 */}
          <IconLinkButton
            iconImage={MokwonViewIcon}
            alt="Mokwon View"
            tooltip="목원뷰"
            onClick={() =>
              handleLinkButtonClick(
                "https://www.mokwon.ac.kr/view/html/sub05/0501.html"
              )
            }
            sx={{
              padding: 0.25,
              backgroundColor: "white",
              borderRadius: "50%",
            }}
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
