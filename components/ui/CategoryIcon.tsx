import { StyleSheet, View } from 'react-native';
import type { ReactElement } from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

type CategorySlug = 'doors' | 'windows' | 'facades' | 'fixed_glass' | 'shutters' | string;

const THEMES: Record<
  string,
  { from: string; to: string; accent: string; soft: string }
> = {
  doors: { from: '#2A3570', to: '#1E275E', accent: '#C9A66B', soft: '#E8ECF8' },
  windows: { from: '#3D7EA6', to: '#2B5F80', accent: '#A8D4EF', soft: '#E8F4FB' },
  facades: { from: '#4A5568', to: '#2D3748', accent: '#90CDF4', soft: '#EDF2F7' },
  fixed_glass: { from: '#5B8FA8', to: '#3A6B82', accent: '#BEE3F8', soft: '#EBF8FF' },
  shutters: { from: '#8B7355', to: '#6B5344', accent: '#E8D5B7', soft: '#F7F1E8' },
};

function DoorArt({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="dFrame" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C9A66B" />
          <Stop offset="1" stopColor="#8B6914" />
        </LinearGradient>
        <LinearGradient id="dPanel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#D6DCF5" />
        </LinearGradient>
      </Defs>
      <Rect x="14" y="8" width="36" height="48" rx="3" fill="url(#dFrame)" />
      <Rect x="18" y="12" width="28" height="40" rx="2" fill="url(#dPanel)" />
      <Rect x="22" y="16" width="20" height="14" rx="1.5" fill="#A8B4E0" opacity="0.55" />
      <Rect x="22" y="34" width="20" height="14" rx="1.5" fill="#A8B4E0" opacity="0.35" />
      <Circle cx="40" cy="32" r="2.2" fill="#C9A66B" />
    </Svg>
  );
}

function WindowArt({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="wFrame" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E8F4FB" />
          <Stop offset="1" stopColor="#B8D4E8" />
        </LinearGradient>
        <LinearGradient id="wGlass" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7EC8E8" />
          <Stop offset="0.5" stopColor="#4BA3C7" />
          <Stop offset="1" stopColor="#2B7A9E" />
        </LinearGradient>
      </Defs>
      <Rect x="10" y="12" width="44" height="40" rx="3" fill="#2B5F80" />
      <Rect x="13" y="15" width="18" height="16" rx="1.5" fill="url(#wGlass)" />
      <Rect x="33" y="15" width="18" height="16" rx="1.5" fill="url(#wGlass)" />
      <Rect x="13" y="33" width="18" height="16" rx="1.5" fill="url(#wGlass)" />
      <Rect x="33" y="33" width="18" height="16" rx="1.5" fill="url(#wGlass)" />
      <Path d="M16 18 L28 26" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
      <Path d="M36 18 L48 26" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
      <Rect x="8" y="50" width="48" height="4" rx="1" fill="#2B5F80" opacity="0.7" />
    </Svg>
  );
}

function FacadeArt({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="fGlass" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#90CDF4" />
          <Stop offset="1" stopColor="#2B6CB0" />
        </LinearGradient>
      </Defs>
      <Rect x="12" y="6" width="40" height="52" rx="2" fill="#2D3748" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <Rect
            key={`${row}-${col}`}
            x={16 + col * 12}
            y={10 + row * 12}
            width="9"
            height="9"
            rx="1"
            fill="url(#fGlass)"
            opacity={0.85 - row * 0.08}
          />
        )),
      )}
      <Path d="M18 12 L24 16" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    </Svg>
  );
}

function FixedGlassArt({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="gPanel" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#BEE3F8" />
          <Stop offset="1" stopColor="#63B3ED" />
        </LinearGradient>
      </Defs>
      <Rect x="8" y="10" width="22" height="44" rx="2" fill="#3A6B82" />
      <Rect x="11" y="13" width="16" height="38" rx="1.5" fill="url(#gPanel)" opacity="0.9" />
      <Rect x="34" y="10" width="22" height="44" rx="2" fill="#3A6B82" />
      <Rect x="37" y="13" width="16" height="38" rx="1.5" fill="url(#gPanel)" opacity="0.75" />
      <Path d="M13 16 L24 28" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <Path d="M39 16 L50 28" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
      <Rect x="29" y="8" width="6" height="48" rx="1" fill="#2B5F80" />
    </Svg>
  );
}

function ShutterArt({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="sSlat" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E8D5B7" />
          <Stop offset="1" stopColor="#C4A574" />
        </LinearGradient>
      </Defs>
      <Rect x="12" y="8" width="40" height="48" rx="3" fill="#6B5344" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Rect
          key={i}
          x="16"
          y={12 + i * 7}
          width="32"
          height="5"
          rx="1"
          fill="url(#sSlat)"
          opacity={0.95 - i * 0.05}
        />
      ))}
      <Rect x="30" y="8" width="4" height="48" fill="#5A4336" />
      <Circle cx="32" cy="32" r="3" fill="#C9A66B" />
      <Circle cx="32" cy="32" r="1.2" fill="#6B5344" />
    </Svg>
  );
}

const ART: Record<string, (p: { size: number }) => ReactElement> = {
  doors: DoorArt,
  windows: WindowArt,
  facades: FacadeArt,
  fixed_glass: FixedGlassArt,
  shutters: ShutterArt,
};

export function CategoryIcon({
  slug,
  size = 56,
  variant = 'soft',
}: {
  slug: CategorySlug;
  size?: number;
  /** soft = pastel circle, filled = solid gradient circle */
  variant?: 'soft' | 'filled';
}) {
  const theme = THEMES[slug] ?? THEMES.doors;
  const Art = ART[slug] ?? DoorArt;
  const artSize = Math.round(size * 0.72);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: variant === 'filled' ? theme.from : theme.soft,
        },
      ]}
    >
      {variant === 'filled' ? (
        <View style={StyleSheet.absoluteFill}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id={`bg-${slug}`} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={theme.from} />
                <Stop offset="1" stopColor={theme.to} />
              </LinearGradient>
            </Defs>
            <Rect width={size} height={size} rx={size * 0.28} fill={`url(#bg-${slug})`} />
          </Svg>
        </View>
      ) : null}
      <Art size={artSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
