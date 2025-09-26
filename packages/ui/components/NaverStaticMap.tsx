import { h } from "preact";
import { useMemo } from "preact/hooks";
import type { JSX } from "preact";
import { withQuery } from "ufo";

// ----- 기본 타입들 -----
export type CRSCode =
  | "EPSG:4326"
  | "NHN:2048"
  | "NHN:128"
  | "EPSG:4258"
  | "EPSG:4162"
  | "EPSG:2096"
  | "EPSG:2097"
  | "EPSG:2098"
  | "EPSG:3857"
  | "EPSG:900913"
  | "EPSG:5179";

export type MapType =
  | "basic"
  | "traffic"
  | "satellite"
  | "satellite_base"
  | "terrain"; // 지도 유형
export type ImageFormat = "jpg" | "jpeg" | "png8" | "png"; // 반환 이미지 형식
export type Scale = 1 | 2; // 1=저해상도, 2=레티나(픽셀 2배)
export type LatLng = [lat: number, lng: number];

// ----- MarkersParam: 정확한 타입 모델링 (문서 규격) -----
// 공통 옵션
type MarkerSize = "tiny" | "small" | "mid";
type PredefinedColor =
  | "Default"
  | "Blue"
  | "Orange"
  | "Yellow"
  | "Red"
  | "Brown"
  | "Green"
  | "Purple"
  | "Gray";
// 24비트 색상 "0xRRGGBB" 허용. TS 상 문자열 패턴 제한(템플릿 리터럴)도 제공.
type HexColor = `0x${string}`; // 런타임에서는 "0x" + 6자리 hex를 기대

/** 지도에 그릴 좌표. crs에 맞는 x y 순서 문자열로 직렬화됨. WGS84는 "경도 위도" */
export type MarkerPos = [x: number, y: number];

// 기본/숫자/알파벳 마커 공통(레이블 가능)
interface BaseSymbolicMarker {
  size?: MarkerSize; // 기본 'mid'. tiny면 label 표시 불가(문서 규정)
  color?: PredefinedColor | HexColor; // 미지정 시 기본색 0x08DA76
  pos: MarkerPos[]; // 하나 이상
}

// 기본 마커(type:d) - viewSizeRatio 지원
export interface DefaultMarker extends BaseSymbolicMarker {
  type: "d";
  /** 0.1~2.0, 소수점 1자리. 마커 기본 디자인 대비 배율 */
  viewSizeRatio?: number;
  label?: never;
}

// 숫자(type:n) — label은 숫자 한 글자(1~9 등)
export interface NumberMarker extends BaseSymbolicMarker {
  type: "n";
  /** 'A-Z' 또는 '0-9'. 하나의 문자만 유효(문서 권장). */
  label?: string;
}

// 알파벳(type:a)
export interface AlphabetMarker extends BaseSymbolicMarker {
  type: "a";
  /** 'A-Z' 또는 '0-9'. 하나의 문자만 유효(문서 권장). */
  label?: string;
}

// 툴팁(type:t) — size는 항상 tiny로 고정(문서 규정)
export interface TooltipMarker {
  type: "t";
  /** color 지원. 기본/hex 동일 규칙 */
  color?: PredefinedColor | HexColor;
  /** tiny 고정이라 size 허용 안 함 */
  size?: never;
  /** 말풍선 텍스트(URI 인코딩되어 전달됨) */
  label: string;
  pos: MarkerPos[]; // 하나 이상
}

// 커스텀 마커(type:e)
export interface ExternalMarker {
  type: "e";
  /** PNG 또는 SVG URL. 2초 내 응답 제한, 캐시 최대 1일(문서 제약) */
  icon: string;
  /** 앵커 위치(마커 이미지 내 기준점). text(키워드) 또는 double(x,y) */
  anchor?:
    | {
        text:
          | "top"
          | "bottom"
          | "left"
          | "right"
          | "center"
          | "topleft"
          | "topright"
          | "bottomleft"
          | "bottomright";
      }
    | { double: [x: number, y: number] }; // 0.00~1.00, 소수점 둘째자리까지
  color?: never; // 커스텀 아이콘은 color/size/viewSizeRatio 미사용
  size?: never;
  label?: never;
  pos: MarkerPos[]; // 하나 이상
}

export type MarkersParam =
  | DefaultMarker
  | NumberMarker
  | AlphabetMarker
  | TooltipMarker
  | ExternalMarker;

// ----- Props: <img> 속성 확장 + 필수 지도 옵션 -----
export interface StaticMapProps
  extends Omit<JSX.HTMLAttributes<HTMLImageElement>, "src"> {
  /** 가로(px) 1~1024 */
  width: number;
  /** 세로(px) 1~1024 */
  height: number;

  /** center="x,y" 또는 [x,y]. markers만으로도 자동 view 가능하여 생략 가능 */
  center?: LatLng | string;
  /** 줌 레벨 0~20. markers만 있으면 생략 가능 */
  level?: number;

  /** 지도 옵션 */
  mapType?: MapType; // 기본 basic
  format?: ImageFormat; // 기본 jpg/jpeg
  scale?: Scale; // 기본 1
  crs?: CRSCode; // 기본 EPSG:4326

  /** 마커 리스트 (여러 set을 전달하면 파라미터를 반복해서 붙입니다) */
  markers?: MarkersParam[];

  /** raster-cors 전용: 쿼리로 전달되는 API Key ID (X-NCP-APIGW-API-KEY-ID) */
  apiKeyId: string;

  /** 기본 엔드포인트/경로 — raster-cors 고정 */
  endpointBaseUrl?: string; // 기본: https://naveropenapi.apigw-pub.fin-ntruss.com
  path?: "/map-static/v2/raster-cors"; // 고정 권장
}

// ----- 내부 유틸 -----
function normalizeCenter(center?: LatLng | string): string | undefined {
  if (!center) return;
  if (Array.isArray(center)) return `${center[1]},${center[0]}`; // x,y(WGS84면 lng,lat)
  const s = center.trim();
  return s ? s : undefined;
}

function setIfDefined(
  qs: URLSearchParams,
  k: string,
  v?: string | number | boolean,
) {
  if (v === undefined || v === null) return;
  qs.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v));
}

// markers 직렬화: 규격 "property:value|property:value|pos:x y,x y"
function encodeMarker(m: MarkersParam): string {
  const parts: string[] = [];

  // type
  parts.push(`type:${m.type}`);

  // size / color / label / viewSizeRatio (규격에 맞는 타입만 허용)
  if ("size" in m && m.size) parts.push(`size:${m.size}`);
  if ("color" in m && m.color) parts.push(`color:${m.color}`);
  if ("label" in m && m.label)
    parts.push(`label:${encodeURIComponent(m.label)}`);

  if (m.type === "d" && m.viewSizeRatio !== undefined) {
    const r = Math.max(
      0.1,
      Math.min(2.0, Math.round(m.viewSizeRatio * 10) / 10),
    ); // 소수1자리 제한
    parts.push(`viewSizeRatio:${r}`);
  }

  if (m.type === "e") {
    // 커스텀 마커 아이콘
    parts.push(`icon:${encodeURIComponent(m.icon)}`);
    if (m.anchor) {
      if ("text" in m.anchor) parts.push(`anchor:${m.anchor.text}`);
      else {
        const [x, y] = m.anchor.double;
        parts.push(`anchor:${x},${y}`); // 0.00~1.00 기대(문서)
      }
    }
  }

  // 위치들 — 공백으로 xy 구분, 콤마로 개별 위치 구분
  const posValue = m.pos.map(([x, y]) => `${x} ${y}`).join(",");
  parts.push(`pos:${posValue}`);

  return parts.join("|");
}

function appendMarkers(qs: URLSearchParams, markers?: MarkersParam[]) {
  if (!markers?.length) return;
  // markers 파라미터는 반복 가능. 각각 append
  for (const m of markers) qs.append("markers", encodeMarker(m));
}

// ----- URL 생성 -----
export function buildStaticMapUrl(props: StaticMapProps): string {
  const {
    width,
    height,
    center,
    level,
    mapType = "basic",
    format = "jpg",
    scale = 1,
    crs = "EPSG:4326",
    markers,
    apiKeyId,
    endpointBaseUrl = "https://maps.apigw.ntruss.com",
    path = "/map-static/v2/raster-cors",
  } = props;

  const url = new URL(path, endpointBaseUrl);
  const qs = new URLSearchParams();

  // 필수
  setIfDefined(qs, "w", width);
  setIfDefined(qs, "h", height);

  // center/level (markers만으로도 자동 view 가능)
  const c = normalizeCenter(center);
  if (c) setIfDefined(qs, "center", c);
  setIfDefined(qs, "level", level);

  // 옵션
  setIfDefined(qs, "maptype", mapType);
  setIfDefined(qs, "format", format);
  setIfDefined(qs, "scale", scale);
  setIfDefined(qs, "crs", crs);

  // markers (반복 파라미터)
  appendMarkers(qs, markers);

  // raster-cors 인증: 쿼리에 KEY-ID
  setIfDefined(qs, "X-NCP-APIGW-API-KEY-ID", apiKeyId);

  url.search = qs.toString();
  return url.toString();
}

// alt, className 그대로 사용. 나머지 img 속성도 모두 전달.
export function NaverStaticMap(props: StaticMapProps) {
  const { width, height, alt = "Map", className } = props;

  const src = useMemo(() => buildStaticMapUrl(props), [props]);

  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}

export function parseNaverURL(appname: string, userAgent: string, query: string) {
  const action = withQuery('search', {
    appname,
    query,
  });
  if (userAgent && userAgent.match(/iPhone|iPad|iPod/)) {
    return [
      true,
      `nmap://${action}`,
      'https://itunes.apple.com/app/id311867728'
    ];
  }
  if (userAgent && userAgent.match(/Android/)) {
    return [
      true,
      `intent://${action}#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`,
      'https://play.google.com/store/apps/details?id=com.nhn.android.nmap'
    ]
  }
  return [
    false,
    withQuery('https://map.naver.com/search', { query }),
  ];
}
