import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function useAdvancedAnalytics() {
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const clickData = useRef<{ [key: string]: number }>({});
  const quadrantTime = useRef({ q1: 0, q2: 0, q3: 0, q4: 0 });
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    sessionStartTime.current = Date.now();
    maxScroll.current = 0;
    clickData.current = {};
    quadrantTime.current = { q1: 0, q2: 0, q3: 0, q4: 0 };
    lastMousePos.current = { x: 0, y: 0, time: Date.now() };

    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = winHeightPx > 0 ? Math.round((scrollPx / winHeightPx) * 100) : 0;
      if (scrolled > maxScroll.current) maxScroll.current = scrolled;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BODY' || target.tagName === 'HTML') return;
      
      const identifier = target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : '');
      clickData.current[identifier] = (clickData.current[identifier] || 0) + 1;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const timeSpent = now - lastMousePos.current.time;
      const widthHalf = window.innerWidth / 2;
      const heightHalf = window.innerHeight / 2;
      const { x, y } = lastMousePos.current;

      if (timeSpent > 0 && timeSpent < 5000) {
        if (x < widthHalf && y < heightHalf) quadrantTime.current.q1 += timeSpent;
        else if (x >= widthHalf && y < heightHalf) quadrantTime.current.q2 += timeSpent;
        else if (x < widthHalf && y >= heightHalf) quadrantTime.current.q3 += timeSpent;
        else quadrantTime.current.q4 += timeSpent;
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const sendMetrics = (isUnloading = false) => {
      const sessionId = sessionStorage.getItem('ksi_session');
      if (!sessionId) return;

      const duration = Math.round((Date.now() - sessionStartTime.current) / 1000);

      const payload = {
        session_id: sessionId,
        page_url: location.pathname,
        duration: duration,
        maxScroll: maxScroll.current,
        clicks: clickData.current,
        quadrants: quadrantTime.current
      };

      if (isUnloading) {
        const url = `${api.defaults.baseURL}/analytics/metrics`;
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true 
        }).catch(() => {});
      } else {
        api.post('/analytics/metrics', payload).catch(() => {});
      }
    };

    const heartbeat = setInterval(() => sendMetrics(false), 60000);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') sendMetrics(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeat);
      sendMetrics(true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

  return null;
}