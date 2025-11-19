import { FaSlidersH, FaBroadcastTower } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import { FaMapLocationDot } from "react-icons/fa6";
import { SiApachekafka } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaNetworkWired } from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";
import { FaFileWord } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { VscServerProcess } from "react-icons/vsc";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoCloudDoneSharp } from "react-icons/io5";
import { SiAmazonsqs } from "react-icons/si";
import { LuBrainCircuit } from "react-icons/lu";
import { GoXCircle } from "react-icons/go";
import { DiRedis } from "react-icons/di";
import { IoMdAnalytics } from "react-icons/io";
import { FaClipboardQuestion } from "react-icons/fa6";
import type { IconType } from "react-icons";

export interface MenuItem {
    control_panel: IconType;
    live_feed: IconType;
    home: IconType;
    geoSearch: IconType;
    pipeline: IconType;
    linkedIn: IconType;
    navMenu: IconType;
    closeMenu: IconType;
    architecture: IconType;
    git: IconType;
    pdf: IconType;
    word: IconType;
    text: IconType;
    processDoc: IconType;
    uploading: IconType;
    sqs: IconType;
    processing: IconType;
    genai: IconType;
    processComplete: IconType;
    geniAIcontent: IconType;
    failedStepIcon: IconType;
    redis: IconType;
    analytics: IconType;
    instructions: IconType;
}

export const menuItems: MenuItem = {
    control_panel: FaSlidersH,
    live_feed: FaBroadcastTower,
    home: ImHome,
    geoSearch: FaMapLocationDot,
    pipeline: SiApachekafka,
    linkedIn: FaLinkedin,
    navMenu: GiHamburgerMenu,
    closeMenu: IoMdClose,
    architecture: FaNetworkWired,
    git: FaGithub,
    pdf: GrDocumentPdf,
    word: FaFileWord,
    text: FiFileText,
    processDoc: MdOutlineDocumentScanner,
    uploading: FaCloudUploadAlt,
    sqs: SiAmazonsqs,
    processing: VscServerProcess,
    genai: HiOutlineSparkles,
    processComplete: IoCloudDoneSharp,
    geniAIcontent: LuBrainCircuit,
    failedStepIcon: GoXCircle,
    redis: DiRedis,
    analytics: IoMdAnalytics,
    instructions: FaClipboardQuestion,
};
