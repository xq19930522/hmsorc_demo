import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type window from "@ohos:window";
/**
 * OCR 智识应用入口
 */
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    }
    onDestroy(): void {
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                return;
            }
        });
    }
    onWindowStageDestroy(): void {
    }
    onForeground(): void {
    }
    onBackground(): void {
    }
}
