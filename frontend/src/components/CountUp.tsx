import React, { useEffect, useRef, useState } from "react";
import { Text, TextStyle } from "react-native";

type Props = {
  value: number;
  duration?: number;
  style?: TextStyle | TextStyle[];
  testID?: string;
};

export function CountUp({ value, duration = 900, style, testID }: Props) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return (
    <Text style={style} testID={testID}>
      {display.toLocaleString("en-IN")}
    </Text>
  );
}
