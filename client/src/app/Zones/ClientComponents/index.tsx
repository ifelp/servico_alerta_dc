'use client'
import ZonePageInfo from "../../../components/zonePageInfo";
import SelectZoneSection from "../../../components/selectZoneSection";
import ZoneButtonFooter from "../../../components/zoneButtonFooter";
import { ZONES } from "../../../utils/mocks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZone } from "../../../contexts/zoneContext";

export default function Zones(){
    const { currentZone, changeZone } = useZone()
    const [selected, setSelected] = useState(currentZone || "zona_A");
    const [confirming, setConfirming] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = () => {
        setConfirming(true);
        changeZone(selected)
        setTimeout(() => navigate("/"), 700);
  };

    return (
        <div className="px-5 pt-6 pb-4">
            <ZonePageInfo/>
            <SelectZoneSection zones={ZONES} selectedZone={selected} setSelectedZone={setSelected}/>
            <ZoneButtonFooter handleConfirm={handleConfirm} confirming={confirming} />
        </div>
    )
}