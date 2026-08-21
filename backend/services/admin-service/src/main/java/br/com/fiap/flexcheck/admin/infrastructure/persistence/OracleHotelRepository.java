package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.domain.entity.HotelProfile;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OracleHotelRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public OracleHotelRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public List<HotelSummaryResult> listHotels() {
        return jdbc.query("""
                        SELECT id, name, owner_name, active
                          FROM fc_hotel
                         ORDER BY id
                        """,
                (rs, rowNum) -> new HotelSummaryResult(
                        rs.getLong("id"),
                        rs.getString("name"),
                        fallbackOwner(rs.getString("owner_name")),
                        isActive(rs.getString("active"))
                ));
    }

    public HotelProfileResult findById(Long hotelId) {
        return toResult(loadOrCreateHotel(hotelId));
    }

    public HotelProfileResult updateBranding(Long hotelId, UpdateHotelBrandingCommand command) {
        HotelProfile current = loadOrCreateHotel(hotelId);
        HotelProfile.Branding branding = new HotelProfile.Branding(
                command.primaryColor(),
                command.secondaryColor(),
                command.accentColor(),
                command.surfaceColor(),
                command.textColor(),
                command.logoUrl() == null ? "" : command.logoUrl().trim(),
                command.activePresetId(),
                command.presets() == null ? List.of() : command.presets().stream()
                        .map(preset -> new HotelProfile.Preset(
                                preset.id(),
                                preset.name(),
                                preset.primaryColor(),
                                preset.secondaryColor(),
                                preset.accentColor(),
                                preset.surfaceColor(),
                                preset.textColor()
                        ))
                        .toList()
        );
        jdbc.update("""
                UPDATE fc_hotel
                   SET name = ?,
                       branding_json = ?,
                       updated_at = ?
                 WHERE id = ?
                """,
                command.hotelName().trim(),
                toJson(branding),
                LocalDateTime.now(),
                hotelId
        );
        return toResult(loadOrCreateHotel(current.id()));
    }

    public HotelProfileResult updateContent(Long hotelId, UpdateHotelContentCommand command) {
        HotelProfile current = loadOrCreateHotel(hotelId);
        jdbc.update("""
                UPDATE fc_hotel
                   SET content_json = ?,
                       updated_at = ?
                 WHERE id = ?
                """,
                toJson(new HotelProfile.Content(
                        command.languageDefault(),
                        List.copyOf(command.supportedLanguages()),
                        command.promotions().stream()
                                .map(promotion -> new HotelProfile.Promotion(
                                        promotion.title(),
                                        promotion.description(),
                                        promotion.active(),
                                        promotion.order()
                                ))
                                .toList(),
                        List.copyOf(command.amenities()),
                        command.mapUrl(),
                        command.supportMessage()
                )),
                LocalDateTime.now(),
                hotelId
        );
        return toResult(loadOrCreateHotel(current.id()));
    }

    private HotelProfile loadOrCreateHotel(Long hotelId) {
        try {
            return jdbc.queryForObject("""
                            SELECT id,
                                   name,
                                   owner_name,
                                   timezone,
                                   checkin_time,
                                   checkout_time,
                                   early_checkin_minutes,
                                   late_checkout_minutes,
                                   active,
                                   created_at,
                                   updated_at,
                                   branding_json,
                                   content_json
                              FROM fc_hotel
                             WHERE id = ?
                            """,
                    (rs, rowNum) -> toProfile(
                            rs.getLong("id"),
                            rs.getString("name"),
                            rs.getString("owner_name"),
                            rs.getString("timezone"),
                            rs.getString("checkin_time"),
                            rs.getString("checkout_time"),
                            rs.getInt("early_checkin_minutes"),
                            rs.getInt("late_checkout_minutes"),
                            rs.getString("active"),
                            toLocalDateTime(rs.getTimestamp("created_at")),
                            toLocalDateTime(rs.getTimestamp("updated_at")),
                            rs.getString("branding_json"),
                            rs.getString("content_json")
                    ),
                    hotelId);
        } catch (EmptyResultDataAccessException ex) {
            HotelProfile fallback = DefaultHotelProfiles.findDefault(hotelId);
            insertHotel(fallback);
            return fallback;
        }
    }

    private void insertHotel(HotelProfile profile) {
        jdbc.update("""
                INSERT INTO fc_hotel (
                    id,
                    name,
                    owner_name,
                    timezone,
                    checkin_time,
                    checkout_time,
                    early_checkin_minutes,
                    late_checkout_minutes,
                    active,
                    created_at,
                    updated_at,
                    branding_json,
                    content_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                profile.id(),
                profile.name(),
                profile.ownerName(),
                profile.timezone(),
                profile.checkinTime(),
                profile.checkoutTime(),
                profile.earlyCheckinMinutes(),
                profile.lateCheckoutMinutes(),
                profile.active() ? "Y" : "N",
                profile.createdAt(),
                profile.updatedAt(),
                toJson(profile.branding()),
                toJson(profile.content())
        );
    }

    private HotelProfile toProfile(
            Long id,
            String name,
            String ownerName,
            String timezone,
            String checkinTime,
            String checkoutTime,
            int earlyCheckinMinutes,
            int lateCheckoutMinutes,
            String active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String brandingJson,
            String contentJson
    ) {
        HotelProfile fallback = DefaultHotelProfiles.findDefault(id);
        HotelProfile.Branding branding = normalizeBranding(parse(brandingJson, HotelProfile.Branding.class, fallback.branding()), fallback.branding());
        HotelProfile.Content content = normalizeContent(parse(contentJson, HotelProfile.Content.class, fallback.content()), fallback.content());
        return new HotelProfile(
                id,
                name,
                fallbackOwner(ownerName),
                timezone == null ? fallback.timezone() : timezone,
                checkinTime == null ? fallback.checkinTime() : checkinTime,
                checkoutTime == null ? fallback.checkoutTime() : checkoutTime,
                earlyCheckinMinutes == 0 ? fallback.earlyCheckinMinutes() : earlyCheckinMinutes,
                lateCheckoutMinutes == 0 ? fallback.lateCheckoutMinutes() : lateCheckoutMinutes,
                branding,
                content,
                isActive(active),
                createdAt == null ? fallback.createdAt() : createdAt,
                updatedAt == null ? fallback.updatedAt() : updatedAt
        );
    }

    private HotelProfileResult toResult(HotelProfile hotel) {
        return new HotelProfileResult(
                hotel.id(),
                hotel.name(),
                hotel.ownerName(),
                hotel.timezone(),
                hotel.checkinTime(),
                hotel.checkoutTime(),
                hotel.earlyCheckinMinutes(),
                hotel.lateCheckoutMinutes(),
                new HotelProfileResult.BrandingResult(
                        hotel.branding().primaryColor(),
                        hotel.branding().secondaryColor(),
                        hotel.branding().accentColor(),
                        hotel.branding().surfaceColor(),
                        hotel.branding().textColor(),
                        hotel.branding().logoUrl(),
                        hotel.branding().activePresetId(),
                        hotel.branding().presets().stream()
                                .map(preset -> new HotelProfileResult.PresetResult(
                                        preset.id(),
                                        preset.name(),
                                        preset.primaryColor(),
                                        preset.secondaryColor(),
                                        preset.accentColor(),
                                        preset.surfaceColor(),
                                        preset.textColor()
                                ))
                                .toList()
                ),
                new HotelProfileResult.ContentResult(
                        hotel.content().languageDefault(),
                        hotel.content().supportedLanguages(),
                        hotel.content().promotions().stream()
                                .map(promotion -> new HotelProfileResult.PromotionResult(
                                        promotion.title(),
                                        promotion.description(),
                                        promotion.active(),
                                        promotion.order()
                                ))
                                .toList(),
                        hotel.content().amenities(),
                        hotel.content().mapUrl(),
                        hotel.content().supportMessage()
                ),
                hotel.active(),
                hotel.createdAt(),
                hotel.updatedAt()
        );
    }

    private <T> T parse(String json, Class<T> type, T fallback) {
        if (json == null || json.isBlank()) {
            return fallback;
        }
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception ex) {
            return fallback;
        }
    }

    private HotelProfile.Branding normalizeBranding(HotelProfile.Branding branding, HotelProfile.Branding fallback) {
        if (branding == null) {
            return fallback;
        }
        List<HotelProfile.Preset> presets = branding.presets() == null || branding.presets().isEmpty()
                ? List.of(originalPreset(), flexMediaPreset())
                : branding.presets().stream()
                .map(preset -> new HotelProfile.Preset(
                        coalesce(preset.id(), ""),
                        canonicalPresetName(coalesce(preset.id(), ""), preset.name()),
                        canonicalPrimaryColor(coalesce(preset.id(), ""), preset.primaryColor(), fallback.primaryColor()),
                        canonicalSecondaryColor(coalesce(preset.id(), ""), preset.secondaryColor(), fallback.secondaryColor()),
                        canonicalAccentColor(coalesce(preset.id(), ""), preset.accentColor(), fallback.accentColor()),
                        canonicalSurfaceColor(coalesce(preset.id(), ""), preset.surfaceColor(), fallback.surfaceColor()),
                        canonicalTextColor(coalesce(preset.id(), ""), preset.textColor(), fallback.textColor())
                ))
                .toList();

        boolean hasOriginal = presets.stream().anyMatch(preset -> "original".equalsIgnoreCase(preset.id()));
        if (!hasOriginal) {
            List<HotelProfile.Preset> nextPresets = new ArrayList<>();
            nextPresets.add(originalPreset());
            nextPresets.add(flexMediaPreset());
            nextPresets.addAll(presets);
            presets = List.copyOf(nextPresets);
        } else {
            boolean hasFlexMedia = presets.stream().anyMatch(preset -> "flexmedia".equalsIgnoreCase(preset.id()));
            if (!hasFlexMedia) {
                List<HotelProfile.Preset> nextPresets = new ArrayList<>();
                nextPresets.add(presets.get(0));
                nextPresets.add(flexMediaPreset());
                nextPresets.addAll(presets.stream().skip(1).toList());
                presets = List.copyOf(nextPresets);
            }
        }

        return new HotelProfile.Branding(
                coalesce(branding.primaryColor(), fallback.primaryColor()),
                coalesce(branding.secondaryColor(), fallback.secondaryColor()),
                coalesce(branding.accentColor(), fallback.accentColor()),
                coalesce(branding.surfaceColor(), fallback.surfaceColor()),
                coalesce(branding.textColor(), fallback.textColor()),
                branding.logoUrl() == null ? fallback.logoUrl() : branding.logoUrl().trim(),
                coalesce(branding.activePresetId(), fallback.activePresetId()),
                presets
        );
    }

    private HotelProfile.Content normalizeContent(HotelProfile.Content content, HotelProfile.Content fallback) {
        if (content == null) {
            return fallback;
        }
        return new HotelProfile.Content(
                coalesce(content.languageDefault(), fallback.languageDefault()),
                content.supportedLanguages() == null || content.supportedLanguages().isEmpty()
                        ? fallback.supportedLanguages()
                        : List.copyOf(content.supportedLanguages()),
                content.promotions() == null || content.promotions().isEmpty()
                        ? fallback.promotions()
                        : content.promotions().stream()
                        .map(promotion -> new HotelProfile.Promotion(
                                coalesce(promotion.title(), "Promotion"),
                                coalesce(promotion.description(), ""),
                                promotion.active(),
                                promotion.order()
                        ))
                        .toList(),
                content.amenities() == null || content.amenities().isEmpty()
                        ? fallback.amenities()
                        : List.copyOf(content.amenities()),
                coalesce(content.mapUrl(), fallback.mapUrl()),
                coalesce(content.supportMessage(), fallback.supportMessage())
        );
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to serialize hotel configuration.", ex);
        }
    }

    private String fallbackOwner(String ownerName) {
        return ownerName == null || ownerName.isBlank() ? "FlexMedia" : ownerName;
    }

    private String coalesce(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String canonicalPresetName(String id, String fallbackName) {
        if ("original".equalsIgnoreCase(id)) {
            return "Original";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "FlexMedia";
        }
        return coalesce(fallbackName, "Preset");
    }

    private String canonicalPrimaryColor(String id, String fallbackColor, String fallback) {
        if ("original".equalsIgnoreCase(id)) {
            return "#b8860b";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "#49663b";
        }
        return coalesce(fallbackColor, fallback);
    }

    private String canonicalSecondaryColor(String id, String fallbackColor, String fallback) {
        if ("original".equalsIgnoreCase(id)) {
            return "#faf8f3";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "#f4f7ef";
        }
        return coalesce(fallbackColor, fallback);
    }

    private String canonicalAccentColor(String id, String fallbackColor, String fallback) {
        if ("original".equalsIgnoreCase(id)) {
            return "#8b7355";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "#5bbd5e";
        }
        return coalesce(fallbackColor, fallback);
    }

    private String canonicalSurfaceColor(String id, String fallbackColor, String fallback) {
        if ("original".equalsIgnoreCase(id)) {
            return "#faf8f3";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "#ffffff";
        }
        return coalesce(fallbackColor, fallback);
    }

    private String canonicalTextColor(String id, String fallbackColor, String fallback) {
        if ("original".equalsIgnoreCase(id)) {
            return "#2c2416";
        }
        if ("flexmedia".equalsIgnoreCase(id)) {
            return "#1f2d1d";
        }
        return coalesce(fallbackColor, fallback);
    }

    private HotelProfile.Preset originalPreset() {
        return new HotelProfile.Preset(
                "original",
                "Original",
                "#b8860b",
                "#faf8f3",
                "#8b7355",
                "#faf8f3",
                "#2c2416"
        );
    }

    private HotelProfile.Preset flexMediaPreset() {
        return new HotelProfile.Preset(
                "flexmedia",
                "FlexMedia",
                "#49663b",
                "#f4f7ef",
                "#5bbd5e",
                "#ffffff",
                "#1f2d1d"
        );
    }

    private boolean isActive(String active) {
        return active == null || active.isBlank() || "Y".equalsIgnoreCase(active) || "TRUE".equalsIgnoreCase(active);
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
