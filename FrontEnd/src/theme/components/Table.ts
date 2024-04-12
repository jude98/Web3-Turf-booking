import { tableAnatomy as parts } from "@chakra-ui/anatomy";
import type {
    PartsStyleObject,
    SystemStyleObject,
} from "@chakra-ui/theme-tools";

const baseStyle: PartsStyleObject<typeof parts> = {
    th: {
        textTransform: "none",
    },
};

const variantDashboard: SystemStyleObject = {
    table: {
        position: "relative",
        fontFamily: "Graphik Web",
    },
    td: {
        paddingBottom: "1.25rem",
        borderBottomColor: "grey",
        borderBottomWidth: 2,
    },
    th: {
        borderBottom: "none",
    },
};

const variants = {
    simple: variantDashboard,
};

export default {
    parts: parts.keys,
    baseStyle,
    variants,
};
