import { useState, useEffect } from "react";
import wmsu_logo from '@/assets/wmsu_logo.png';
import { Loader2 } from "lucide-react";

export function CheckConnection () {

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/health");
                const data = await response.json();
                setIsOnline(data.status === "ok");
            } catch (error) {
                setIsOnline(false);
            }
        };

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Check once on mount
        checkConnection();

        // Listen for browser online/offline events
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Retry every 10 seconds so it recovers when the server comes back
        const interval = setInterval(checkConnection, 10000);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, []);
    
    return (
        <main>
            {
                isOnline ? (
                    null
                ) : (
                    <div className="fixed bottom-0 top-0 right-0 left-0 z-[60] bg-red border-y-[24px] border-red flex justify-center items-center">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <img src={wmsu_logo} alt="" srcset="" className="size-28" />
                        <p className="text-center text-4xl drop-shadow-md text-custom-primary font-freshman ">WMSU SPORTS</p>
            <p className="text-lg md:text-xl drop-shadow-md text-white">The Official WMSU Sports Event Website</p>
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="size-5 animate-spin text-white" />
                            <p className="font-bold text-2xl text-white ">Loading data...</p>
                        </div>
                    </div>
                </div>
                )
            }
        </main>
        
        
    );
}