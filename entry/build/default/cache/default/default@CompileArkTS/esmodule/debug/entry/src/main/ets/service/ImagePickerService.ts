import photoAccessHelper from "@ohos:file.photoAccessHelper";
import camera from "@ohos:multimedia.camera";
import cameraPicker from "@ohos:multimedia.cameraPicker";
import type common from "@ohos:app.ability.common";
import type { BusinessError } from "@ohos:base";
import { Logger } from "@normalized:N&&&entry/src/main/ets/common/Logger&";
/**
 * 图片获取服务：系统图库选择器 + 系统相机拍照
 * 两者均为系统级 Picker，应用侧无需申请图库/相机权限
 */
export class ImagePickerService {
    /**
     * 拉起系统图库选择一张图片
     * @returns 选中图片的 uri；用户取消或选择异常时返回 undefined
     */
    static async pickFromGallery(): Promise<string | undefined> {
        try {
            const options = new photoAccessHelper.PhotoSelectOptions();
            options.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
            options.maxSelectNumber = 1;
            const picker = new photoAccessHelper.PhotoViewPicker();
            const result = await picker.select(options);
            if (result.photoUris !== undefined && result.photoUris.length > 0) {
                return result.photoUris[0];
            }
            return undefined;
        }
        catch (e) {
            const error = e as BusinessError;
            Logger.warn(`pickFromGallery failed, code: ${error.code}, message: ${error.message}`);
            return undefined;
        }
    }
    /**
     * 拉起系统相机拍摄一张照片（cameraPicker 方式无需相机权限）
     * @returns 拍摄图片的 uri；用户取消或拍摄异常时返回 undefined
     */
    static async takePhoto(context: common.UIAbilityContext): Promise<string | undefined> {
        try {
            const profile: cameraPicker.PickerProfile = {
                cameraPosition: camera.CameraPosition.CAMERA_POSITION_BACK
            };
            const result = await cameraPicker.pick(context, [cameraPicker.PickerMediaType.PHOTO], profile);
            if (result.resultUri !== undefined && result.resultUri.length > 0) {
                return result.resultUri;
            }
            return undefined;
        }
        catch (e) {
            // 用户取消拍照时系统会返回错误码，属正常流程，静默降级
            const error = e as BusinessError;
            Logger.warn(`takePhoto cancelled or failed, code: ${error.code}, message: ${error.message}`);
            return undefined;
        }
    }
}
