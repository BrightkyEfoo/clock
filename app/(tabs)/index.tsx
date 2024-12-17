import { transform } from "@babel/core";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  Filter,
  Line,
  Path,
  Text as SvgText,
} from "react-native-svg";

const { width, height } = Dimensions.get("screen");

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

export default function HomeScreen() {
  const secondHandAngle = useSharedValue(0);

  const secondHandRotate = useAnimatedProps(() => {
    return {
      transform: `rotate(${98} ${width / 2},${width / 2})`,
      // rotation: secondHandAngle.value,
    };
  }, [secondHandAngle]);

  // useEffect(() => {
  //   secondHandAngle.value = withRepeat(
  //     withTiming(, { duration: 60000, easing: (t) => t }), // 60 secondes pour 360 degrés
  //     Infinity, // répéter indéfiniment
  //     true // sans inversion
  //   );
  // }, []);

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
          borderWidth: 1,
          borderColor: "white",
        }}
      >
        <Svg height={width} width={width}>
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
            strokeOpacity={0.4}
            filter="url(#shadow)"
          />
          {/* Cercle principal */}
          <Circle
            cx={"50%"}
            cy={"50%"}
            r={_clockRadius}
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
          />

          {/* second hand  */}
          <AnimatedPath
            stroke={"#155c00ff"}
            d={`M ${width / 2},${width / 2 + 20} V ${_secondHandSize}`}
            strokeWidth={1}
            animatedProps={secondHandRotate}
            originX={width / 2}
            originY={width / 2}
          />

          <Circle cx={"50%"} cy={"50%"} r={5} fill="#8b8b8bff" />

          {/* minute hand  */}
          <AnimatedPath
            stroke={"#8b8b8bff"}
            d={`M ${width / 2},${width / 2} V ${_minuteHandSize}`}
            strokeWidth={3}
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
        </Svg>

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
