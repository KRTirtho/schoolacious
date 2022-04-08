import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function BackButton() {
    const navigate = useNavigate();
    return (
        <div>
            <IconButton
                onClick={() => navigate(-1)}
                aria-label="back"
                icon={<FaAngleLeft />}
                variant="ghost"
            />
        </div>
    );
}
