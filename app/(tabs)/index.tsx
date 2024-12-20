import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  Filter,
  Line,
  Path,
} from "react-native-svg";

const { width } = Dimensions.get("screen");

const _clockRadius = width * 0.3;

const _indicatorBoxSize = 30;

// differentiels de translation de repere au centre
const _dx = width / 2;
const _dy = width / 2;

const _indicatorSpaceToClock = 2;

const _smallIndicatorsSnapAngle = 30; // en degrees
const _smallIndicatorsBigRadius = _clockRadius * 0.92; // rayon du cercle formé par les pointes les plus proches du cercle des indicateurs
const _smallIndicatorsSmallRadius = _clockRadius * 0.84; // rayon du cercle formé par les pointes les plus eliognees du cercle des indicateurs

const _secondHandSize = _clockRadius;
const _minuteHandSize = _clockRadius * 1.2;
const _hourHandSize = _clockRadius * 1.4;

const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

const sin = Math.sin;
const cos = Math.cos;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function HomeScreen() {
  const now = new Date();
  const [time, setTime] = useState({
    seconds: now.getSeconds(),
    minutes: now.getMinutes(),
    hours: now.getHours(),
  });

  useEffect(() => {
    const s = setInterval(() => {
      setTime((prev) => {
        const actualSeconds = (prev.seconds + 1) % 60;
        const actualMinutes =
          actualSeconds === 0 ? (prev.minutes + 1) % 60 : prev.minutes;
        const actualHours =
          actualMinutes === 0 && actualSeconds === 0
            ? (prev.hours + 1) % 24
            : prev.hours;
        return {
          seconds: actualSeconds,
          minutes: actualMinutes,
          hours: actualHours,
        };
      });
    }, 1000);

    return () => {
      clearInterval(s);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#040316",
      }}
    >
      <StatusBar hidden />

      <View
        style={{
          height: width,
          width: width,
          position: "relative",
        }}
      >
        <AnimatedSvg height={width} width={width}>
          <Defs>
            <Filter id="shadow">
              <FeGaussianBlur stdDeviation="100" />
            </Filter>
          </Defs>
          {/* Ombre floutée */}
          <Circle
            cx={"50%"}
            cy={"50%"}
            r={_clockRadius + 2}
            fill="none"
            stroke="#dbd66eff"
            strokeWidth={2}
            strokeOpacity={0.4}
            filter="url(#shadow)"
          />
          {/* Cercle principal */}
          <Circle
            cx={"50%"}
            cy={"50%"}
            r={_clockRadius}
            strokeWidth={2}
            fill="none"
            stroke={"#dbd66e3a"}
          />

          {/* hour hand  */}
          <AnimatedPath
            stroke={"#008a29ff"}
            d={`M ${width / 2},${width / 2} V ${_hourHandSize}`}
            strokeWidth={5}
            originX={width / 2}
            originY={width / 2}
            rotation={time.hours * 15}
            origin={[width / 2]}
          />

          {/* second hand  */}
          <AnimatedPath
            stroke={"#155c00ff"}
            d={`M ${width / 2},${width / 2 + 20} V ${_secondHandSize}`}
            strokeWidth={1}
            rotation={time.seconds * 6}
            origin={[width / 2]}
          />

          <Circle cx={"50%"} cy={"50%"} r={5} fill="#8b8b8bff" />

          {/* minute hand  */}
          <AnimatedPath
            stroke={"#8b8b8bff"}
            d={`M ${width / 2},${width / 2} V ${_minuteHandSize}`}
            strokeWidth={3}
            rotation={time.minutes * 6}
            origin={[width / 2]}
          />

          {Array(12)
            .fill(0)
            .map((_, idx) => {
              if (idx % 3 === 0) return null;
              const angle = degToRad(idx * _smallIndicatorsSnapAngle);
              const x1 = _smallIndicatorsBigRadius * cos(angle) + _dx;
              const y1 = _smallIndicatorsBigRadius * sin(angle) + _dy;

              const x2 = _smallIndicatorsSmallRadius * cos(angle) + _dx;
              const y2 = _smallIndicatorsSmallRadius * sin(angle) + _dy;

              return (
                <Line
                  key={`small-indicator-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={"#d6d1703a"}
                />
              );
            })}
        </AnimatedSvg>

        <View
          style={[
            styles.indicatorBox,
            {
              top: -_clockRadius + _dy,
              left: _dx,
              transform: [
                { translateX: -_indicatorBoxSize / 2 },
                { translateY: _indicatorSpaceToClock },
              ],
            },
          ]}
        >
          <Text style={[styles.indicatorText]}>12</Text>
        </View>
        <View
          style={[
            styles.indicatorBox,
            {
              top: _dy,
              left: _clockRadius + _dx,
              transform: [
                { translateY: -_indicatorBoxSize / 2 },
                { translateX: -_indicatorSpaceToClock - _indicatorBoxSize },
              ],
            },
          ]}
        >
          <Text style={[styles.indicatorText]}>3</Text>
        </View>

        <View
          style={[
            styles.indicatorBox,
            {
              top: _clockRadius + _dy,
              left: _dx,
              transform: [
                { translateX: -_indicatorBoxSize / 2 },
                { translateY: -_indicatorSpaceToClock - _indicatorBoxSize },
              ],
            },
          ]}
        >
          <Text style={[styles.indicatorText]}>6</Text>
        </View>
      </View>

      <View
        style={[
          styles.indicatorBox,
          {
            top: _dy,
            left: -_clockRadius + _dx,
            transform: [
              { translateY: -_indicatorBoxSize / 2 },
              { translateX: _indicatorSpaceToClock },
            ],
          },
        ]}
      >
        <Text style={[styles.indicatorText]}>9</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 25,
        }}
      >
        <Text style={{ color: "#ddd", fontSize: 40 }}>
          {time.hours.toString().padStart(2, "0")}:
          {time.minutes.toString().padStart(2, "0")}:
          {time.seconds.toString().padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorBox: {
    width: _indicatorBoxSize,
    height: _indicatorBoxSize,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorText: {
    color: "#d6d1703a",
    fontSize: 14,
    fontWeight: "bold",
  },
});
