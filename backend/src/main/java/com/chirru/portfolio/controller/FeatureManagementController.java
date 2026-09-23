package com.chirru.portfolio.controller;

import com.chirru.portfolio.service.FeatureManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FeatureManagementController {
    private final FeatureManagementService service;

    @PostMapping("/portfolio/analytics/event")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void event(@RequestBody Map<String,Object> body) {
        String type=String.valueOf(body.getOrDefault("eventType","page_view"));
        if(!List.of("page_view","project_view","resume_download").contains(type)) type="page_view";
        service.recordEvent(type,str(body,"path"),longValue(body.get("projectId")),str(body,"referrer"),str(body,"country"),str(body,"device"),str(body,"visitorHash"));
    }
    @GetMapping("/portfolio/social-links") public List<Map<String,Object>> publicSocialLinks(){return service.socialLinks(true);}
    @GetMapping("/portfolio/seo") public Map<String,Object> publicSeo(@RequestParam(defaultValue="home") String page){return service.seo(page);}
    @GetMapping("/portfolio/project/{projectId}/technologies") public List<Map<String,Object>> publicProjectTechnologies(@PathVariable long projectId){return service.projectTechnologies(projectId);}
    @GetMapping("/portfolio/search") public List<Map<String,Object>> publicSearch(@RequestParam String q){return service.search(q.trim());}

    @GetMapping("/admin/analytics/dashboard") @PreAuthorize("hasRole('ADMIN')") public Map<String,Object> analyticsDashboard(){return service.dashboard();}
    @GetMapping("/admin/analytics") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> analytics(@RequestParam(defaultValue="30") int days){return service.analytics(Math.max(1,Math.min(days,365)));}
    @GetMapping("/admin/settings") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> settings(){return service.settings();}
    @PutMapping("/admin/settings/{key}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void setting(@PathVariable String key,@RequestBody Map<String,Object> body){service.setSetting(key,str(body,"value"));}
    @GetMapping("/admin/social-links") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> socialLinks(){return service.socialLinks(false);}
    @PostMapping("/admin/social-links") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> social(@RequestBody Map<String,Object> b){return Map.of("id",service.saveSocial(longValue(b.get("id")),str(b,"platform"),str(b,"label"),str(b,"url"),str(b,"icon"),intValue(b.get("displayOrder")),bool(b.get("visible"))));}
    @DeleteMapping("/admin/social-links/{id}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void socialDelete(@PathVariable long id){service.deleteSocial(id);}
    @GetMapping("/admin/seo/{page}") @PreAuthorize("hasRole('ADMIN')") public Map<String,Object> seo(@PathVariable String page){return service.seo(page);}
    @PutMapping("/admin/seo/{page}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void seoSave(@PathVariable String page,@RequestBody Map<String,Object> b){service.saveSeo(page,str(b,"title"),str(b,"description"),str(b,"keywords"),str(b,"canonicalUrl"),str(b,"ogImageUrl"),bool(b.get("noIndex")));}

    @GetMapping("/admin/technologies") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> technologies(){return service.technologies();}
    @PostMapping("/admin/technologies") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> technology(@RequestBody Map<String,Object> b){return Map.of("id",service.saveTechnology(longValue(b.get("id")),str(b,"name")));}
    @DeleteMapping("/admin/technologies/{id}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void technologyDelete(@PathVariable long id){service.deleteTechnology(id);}
    @PutMapping("/admin/projects/{projectId}/technologies") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void projectTechnologies(@PathVariable long projectId,@RequestBody Map<String,Object> b){Object ids=b.get("technologyIds");if(!(ids instanceof List<?> list)){service.setProjectTechnologies(projectId,List.of());return;}service.setProjectTechnologies(projectId,list.stream().map(FeatureManagementController::longValue).filter(java.util.Objects::nonNull).toList());}

    @GetMapping("/admin/media") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> media(@RequestParam(required=false) String folder){return service.media(folder);}
    @PostMapping("/admin/media/record") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED) public void mediaRecord(@RequestBody Map<String,Object> b){service.saveMedia(str(b,"folder"),str(b,"resourceType"),str(b,"publicId"),str(b,"url"),str(b,"originalFilename"),str(b,"mimeType"),longValue(b.get("bytes")),intValue(b.get("width")),intValue(b.get("height")));}
    @DeleteMapping("/admin/media/record") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void mediaDelete(@RequestParam String publicId){service.deleteMedia(publicId);}
    @GetMapping("/admin/resumes") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> resumes(){return service.resumes();}
    @PostMapping("/admin/resumes") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> resume(@RequestBody Map<String,Object> b){return Map.of("id",service.saveResume(longValue(b.get("id")),str(b,"title"),str(b,"url"),str(b,"publicId"),str(b,"versionLabel"),bool(b.get("active"))));}
    @DeleteMapping("/admin/resumes/{id}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void resumeDelete(@PathVariable long id){service.deleteResume(id);}
    @GetMapping("/admin/notifications") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> notifications(@RequestParam(defaultValue="false") boolean unreadOnly){return service.notifications(unreadOnly);}
    @PostMapping("/admin/notifications") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> notification(@RequestBody Map<String,Object> b){return Map.of("id",service.notification(str(b,"type"),str(b,"title"),str(b,"body"),str(b,"link")));}
    @PutMapping("/admin/notifications/{id}/read") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT) public void notificationRead(@PathVariable long id){service.markNotificationRead(id);}
    @GetMapping("/admin/search") @PreAuthorize("hasRole('ADMIN')") public List<Map<String,Object>> adminSearch(@RequestParam String q){return service.search(q.trim());}

    private static String str(Map<String,Object> b,String k){Object v=b.get(k);return v==null?null:String.valueOf(v);}
    private static Long longValue(Object v){if(v==null)return null;if(v instanceof Number n)return n.longValue();try{return Long.valueOf(String.valueOf(v));}catch(Exception e){return null;}}
    private static Integer intValue(Object v){if(v==null)return null;if(v instanceof Number n)return n.intValue();try{return Integer.valueOf(String.valueOf(v));}catch(Exception e){return 0;}}
    private static Boolean bool(Object v){if(v==null)return null;if(v instanceof Boolean b)return b;return Boolean.parseBoolean(String.valueOf(v));}
}
