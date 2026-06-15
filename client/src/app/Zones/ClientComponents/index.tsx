'use client'
import ZonePageInfo from "../../../components/zonePageInfo";
import SelectZoneSection from "../../../components/selectZoneSection";
import ZoneButtonFooter from "../../../components/zoneButtonFooter";
import { ZONES } from "../../../utils/mocks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Zones(){
    const zoneId = "zona_A"
    const [selected, setSelected] = useState(zoneId);
    const [confirming, setConfirming] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = () => {
        setConfirming(true);
        // setZone(selected); Construir um contexto global para guardar estado da zona.
        setTimeout(() => navigate("/"), 700);
  };

    return (
        <div className="px-5 pt-6">
            <ZonePageInfo/>
            <SelectZoneSection zones={ZONES} selectedZone={selected} setSelectedZone={setSelected}/>
            <ZoneButtonFooter handleConfirm={handleConfirm} confirming={confirming} />
        </div>
    )
}