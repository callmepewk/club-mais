import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function PageViewTracker() {
  const location = useLocation();
  const sessionId = useRef(null);
  const pageStartTime = useRef(null);
  const currentPageView = useRef(null);

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  useEffect(() => {
    const trackPageView = async () => {
      if (currentPageView.current) {
        const duration = Math.floor((Date.now() - pageStartTime.current) / 1000);
        await base44.entities.PageView.update(currentPageView.current, { duration_seconds: duration });
      }

      const pageName = location.pathname.split('/').pop() || 'Home';
      const deviceType = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) 
        ? 'mobile' 
        : /Tablet|iPad/i.test(navigator.userAgent) 
          ? 'tablet' 
          : 'desktop';

      let userEmail = null;
      try {
        const user = await base44.auth.me();
        userEmail = user?.email;
      } catch (e) {}

      const pageView = await base44.entities.PageView.create({
        page_name: pageName,
        user_email: userEmail,
        session_id: sessionId.current,
        device_type: deviceType,
        referrer: document.referrer || 'direct',
        duration_seconds: 0
      });

      currentPageView.current = pageView.id;
      pageStartTime.current = Date.now();
    };

    trackPageView();

    return () => {
      if (currentPageView.current && pageStartTime.current) {
        const duration = Math.floor((Date.now() - pageStartTime.current) / 1000);
        base44.entities.PageView.update(currentPageView.current, { duration_seconds: duration });
      }
    };
  }, [location]);

  return null;
}